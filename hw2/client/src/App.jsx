import useProfiles from './hooks/useProfiles.js';

export default function App() {
  const { profiles, loading, error } = useProfiles();

  return (
    <main>
      <h1>Hẹn hò nhưng không yêu</h1>

      {loading && <p>Đang tải...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <ul>
          {profiles.map((profile) => (
            <li key={profile._id}>
              {profile.avatar} {profile.name}, {profile.age} tuổi
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
