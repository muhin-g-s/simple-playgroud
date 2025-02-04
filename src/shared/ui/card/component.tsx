import styles from './styles.module.css';

interface CardComponentProps {
  children: React.ReactNode;
}

export function CardComponent({ children } : CardComponentProps) {
  return (
   <div className={styles.card}>
	 	{children}
	 </div>
  )
}