import classNames from "classnames";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      width={44}
      height={44}
      viewBox="0 0 66 66"
      fill="none"
      stroke="currentColor"
      role="graphics-symbol"
      className={classNames("animate-spinner-outer", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="animate-spinner-inner origin-center"
        cx={33}
        cy={33}
        r={20}
        strokeWidth={4}
        strokeDasharray={125}
        strokeLinecap="round"
      ></circle>
    </svg>
  );
}
