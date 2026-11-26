import styles from './Card.module.css';

export default function Card({ profile }) {
  const { name, age, bio, avatar } = profile;

  return (
    <article className={styles.card}>
      <span className={styles.avatar} role="img" aria-label={`Ảnh đại diện của ${name}`}>
        {avatar}
      </span>
      <h2 className={styles.name}>
        {name}, <span className={styles.age}>{age}</span>
      </h2>
      <p className={styles.bio}>{bio}</p>
    </article>
  );
}
