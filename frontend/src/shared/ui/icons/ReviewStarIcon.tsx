interface ReviewStarIconProps {
  active?: boolean;
  className?: string;
}

const ReviewStarIcon = ({ active = false, className }: ReviewStarIconProps) => (
  <svg
    className={className}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.9991 23.1115L21.5325 26.4581C22.5458 27.0715 23.7858 26.1648 23.5191 25.0181L22.0525 18.7248L26.9458 14.4848C27.8391 13.7115 27.3591 12.2448 26.1858 12.1515L19.7458 11.6048L17.2258 5.65814C16.7725 4.57814 15.2258 4.57814 14.7725 5.65814L12.2525 11.5915L5.81245 12.1381C4.63912 12.2315 4.15912 13.6981 5.05245 14.4715L9.94579 18.7115L8.47912 25.0048C8.21245 26.1515 9.45245 27.0581 10.4658 26.4448L15.9991 23.1115Z"
      fill={active ? "#FFB800" : "#D9D9D9"}
    />
  </svg>
);

export default ReviewStarIcon;
