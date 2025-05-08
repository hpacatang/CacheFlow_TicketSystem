import './Button.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button className={`btn ${className || ''}`} onClick={onClick}>
      {text}
    </button>
  );
};
