import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signup(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 flex flex-col gap-4">
        <h2>Sign Up</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-light-100/5 text-white px-4 py-3 rounded-lg outline-hidden"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-light-100/5 text-white px-4 py-3 rounded-lg outline-hidden"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-light-100/5 text-white px-4 py-3 rounded-lg outline-hidden"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-light-100/10 text-white py-3 rounded-lg hover:bg-light-100/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-gray-100 text-center">
          Already have an account? <Link to="/login" className="text-light-200 underline">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;