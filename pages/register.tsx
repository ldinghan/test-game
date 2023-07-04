import { useState } from 'react';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set } from "firebase/database";
import Navbar from '../components/Navbar';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async (e:any) => {
    e.preventDefault();
    const generateColor = () => {
      return Math.floor(Math.random()*16777215).toString(16);       
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User registration successful
      if (auth.currentUser && auth.currentUser.email) {
        let playerId, playerRef;
        playerId = auth.currentUser.uid;
        playerRef = ref(database, `players/${playerId}`);
        set(playerRef, {
          id: playerId,
          name: auth.currentUser.email.substring(0, auth.currentUser.email.indexOf("@")),
          coins: 0,
          x: 0,
          y: 0,
          color: `#${generateColor()}`
        });
      }
      window.location.href="/login";
    } catch (error:any) {
      setError(error.message);
    }
  };


  return (
    <>
    <Navbar />
    <div>
      <h2 className='text-4xl text-center mb-5'>Register</h2>
      <form className='flex justify-center items-center flex-col' onSubmit={handleRegistration}>
        <div className='my-2'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-black mx-2'
          />
        </div>
        <div className='my-2'>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-black mx-2'
          />
        </div>
        <div>
          <button type="submit" className="border border-2 hover:border-white px-5 h-full w-full flex justify-evenly items-center hover:bg-gradient-to-r hover:from-violet-200 hover:to-emerald-200">
            Register
          </button>
        </div>
      </form>
      {error && <p>{error}</p>}
    </div>
    </>
  );
}

export default Register;