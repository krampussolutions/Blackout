type FollowButtonProps = {
  isFollowing?: boolean;
  className?: string;
};

export default function FollowButton({ isFollowing = false, className = "" }: FollowButtonProps) {
  return (
    <button
      type="button"
      className={`${isFollowing ? "button-secondary" : "button-primary"} ${className}`.trim()}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
