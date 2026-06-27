'use client'
import { FormEvent, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import useAuth from "../components/useAuth";

export default function Valkommen() {
    
    return (
        <main className="min-h-screen bg-gradient-stars pt-3">
            <p>Hej</p>
        </main>
    )
}