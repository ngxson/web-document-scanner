import { useState } from 'react';
import { useAppContext } from '../AppContext';

function LoginScreen() {
  const { login } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [passwd, setPasswd] = useState('');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(passwd);
    if (success) {
      // page will be reloaded
    } else {
      setLoading(false);
    }
  };

  return <>
    <div className="card" style={{ maxWidth: '30em' }}>
      <div className="card-body">
        <h5 className="card-title">Login</h5>

        <br/>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Please enter your password</label>
            <input type="password" className="form-control"  placeholder="Password" value={passwd} onChange={e => setPasswd(e.target.value)} disabled={loading} />
          </div>

          <br/>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Access'}
          </button>
        </form>
      </div>
    </div>
  </>;
}

export default LoginScreen;
