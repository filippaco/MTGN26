"use client";
import { useEffect, useState } from "react";
import useAuth from "../components/useAuth";

export default function N0llanGrupper() {
  const [users, setUsers] = useState<
    {
      profilePic: string;
      name: string;
      funFact: string;
      phosGroup?: string;
      group: string;
    }[]
  >([]);
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);
  const [currentUser, setCurrentUser] = useState<{
    profilePic: string;
    name: string;
    funFact: string;
  } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [color, setColor] = useState<string>("white")
  const [disable, setDisable] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0);
  const [userType, setUserType] = useState<string>("all"); // State for user type filter
  const [recentUsers, setRecentUsers] = useState<string[]>([]); // State to track recently shown users
  const COOLDOWN_SIZE = 5; // Cooldown time in seconds

  const { user } = useAuth();

  // Fetching users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        return <h1>Please login</h1>;
      }
      const token = await user.getIdToken();
      try {
        const response = await fetch("/api/getUsers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data); // Initialize with all users
          setNewQuestion(data); // Set a new question when users are fetched
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [user]);

  // Function to set a new question
  const setNewQuestion = (usersArray: typeof users) => {
    // Filter users based on the selected type
    const filtered = usersArray.filter((user) => {
      if (user.profilePic === '/defaultprofile.svg') {
        return false
      }
      return true; // For "all", return all users
    });
    
    if (filtered.length > 0) {
      const availableUsers = filtered.filter(
        (user) => !recentUsers.includes(user.name)
      );

      const pool = availableUsers.length > 0 ? availableUsers : filtered; // If all users are in cooldown, use the full filtered list
      const randomUser = pool[Math.floor(Math.random() * pool.length)];
      setCurrentUser(randomUser);
      setRecentUsers((prev) => [...prev, randomUser.name].slice(-COOLDOWN_SIZE)); // Add to recent users and maintain cooldown size

      // Create options for the user to choose from
      const shuffledUsers = [...filtered].sort(() => 0.5 - Math.random());
      const options = shuffledUsers.slice(0, 4).map((user) => user.name);

      // Ensure the correct answer is in the options
      if (!options.includes(randomUser.name)) {
        options[Math.floor(Math.random() * 4)] = randomUser.name;
      }

      setOptions(options);
      setMessage(""); // Clear any previous message
    }
  };

  // Function to handle the guess
  const handleGuess = (guess: string) => {
    if (currentUser && guess === currentUser.name) {
      setScore((prevScore) => prevScore + 1); // Increase score for correct guess
      setMessage("Rätt! 😼");
      setColor("#74DF77");
      setDisable(true);
      setTimeout(() => {
        setNewQuestion(filteredUsers); // Set a new question after a short delay
        setDisable(false);
      }, 1500);
    } else {
      setScore(0); // Reset score for incorrect guess
      if (message == "Fel, försök igen 😭💔") {
        // Andra felmeddelandet
        setMessage("Fel, du försökte igen, försök igen igen 🤣");
      } 
      else if (message == "Fel, du försökte igen, försök igen igen 🤣") {
        // Tredje felmeddelandet
        setMessage("Bror... det finns bara ett alternativ kvar 🤡🫢 (eller har du bara lallat och tryckt på samma knapp flera gånger? 🤪) (EHDBLOTPSKFG?)");
      } 
      else if (message == "Bror... det finns bara ett alternativ kvar 🤡🫢 (eller har du bara lallat och tryckt på samma knapp flera gånger? 🤪) (EHDBLOTPSKFG?)") {
        //Förhoppningsvis sista felmeddelandet (nope)
        setMessage("Rött! 🙂‍↔️🙅‍♂️");
      }
      else if (message == "Rött! 🙂‍↔️🙅‍♂️") {
        //Förhoppningsvis sista felmeddelandet
        setMessage("Det var en gång två webbisar som hette Eddie och Neo from the hit blockbuster motion picture The Matrix, made by the Wachowskis in 1999, starring Keanu Reeves. Det var en solig dag och webbisarna satt inburade och skulle skriva sin kod. Istället för att fixa buggen som webbgruppsledaren Loke hade bett om spenderade Neo och Eddie istället mer än en timme på dessa felmeddelanden. OBS: Loke om du läser detta: ples don't be mad, vi fixade faktiskt typ tre issues och du har ändå inte fixat klart pull requestsen. Jk jk unless? 👁️👃👁️ och om nØllan läser det här får nØllan gärna kontakta oss (nØllan kan till exempel säga en fett cool hemlig fras till oss som typ 'Jag hade rött!', vi har 6st pins att ge ut) och ignorera alla buggar snälla🥺🙏❤️ Vi tror okså att nØllan måste öva mer på namn");
      }
      else
      {  // Första felmeddelandet
      setMessage("Fel, försök igen 😭💔");
      }
      setColor("#EF5D60");
    }
  };

  // Handle user 😭type filter change
  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    const newFilteredUsers = users.filter((user) => {
      if (user.profilePic === '/defaultprofile.svg') {
        return false
      }
      if (type === "phosare") {
        return user.phosGroup !== undefined;
      } else if (type === "n0llan") {
        return user.phosGroup === undefined;
      }
      return true; // For "all", return all users
    });
    setFilteredUsers(newFilteredUsers);
    setNewQuestion(newFilteredUsers); // Set a new question with the updated filter
  };

  if (!user) {
    return <h1>Please login :|</h1>;
  }

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center">
      {/* Filter Options */}
      <div className="mb-4">
        <button
          onClick={() => handleUserTypeChange("all")}
          className={`px-4 py-2 mx-2 ${
            userType === "all" ? "border-light-yellow border" : ""
          } bg-almost-black text-white font-semibold rounded-lg shadow-pink-glow`}
        >
          Blandat
        </button>
        <button
          onClick={() => handleUserTypeChange("phosare")}
          className={`px-4 py-2 mx-2 ${
            userType === "phosare" ? "border-light-yellow border" : ""
          } bg-almost-black text-white font-semibold rounded-lg shadow-pink-glow`}
        >
          Phösare
        </button>
        <button
          onClick={() => handleUserTypeChange("n0llan")}
          className={`px-4 py-2 mx-2 ${
            userType === "n0llan" ? "border-light-yellow border" : ""
          } bg-almost-black text-white font-semibold rounded-lg shadow-pink-glow`}
        >
          nØllan
        </button>
      </div>

      {currentUser && (
        <div className="bg-almost-black p-4 rounded-lg shadow-lg text-center">
          <img
            src={currentUser.profilePic}
            alt="Who is this?"
            className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-amber-50">???</h2>
          <p className="text-amber-50">Fun fact: {currentUser.funFact}</p>
        </div>
      )}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {options.length > 0 ? (
          options.map((option, index) => (
            <button disabled={disable}
              key={index}
              onClick={() => handleGuess(option)}
              className="px-4 py-2 bg-almost-black text-amber-50 font-semibold rounded-lg shadow-pink-glow hover: bg-almost-black"
            >
              {option}
            </button>
          ))
        ) : (
          <p className="text-white">Loading options...</p>
        )}
      </div>
      {message && (
        <div className="mt-4 text-lg font-bold" style={{WebkitTextFillColor : color}} >{message}</div>
      )}
      <div className="mt-4 text-lg font-bold text-amber-50">Streak: {score}</div>
    </main>
  );
}
