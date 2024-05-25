import { cn } from '@/lib/utils';

interface IMessageProps extends React.ComponentPropsWithoutRef<'div'> {
  heading?: React.JSX.Element | string;
  subHeading?: React.JSX.Element | string;
  icon?: React.JSX.Element;
}

export const Message: React.FC<IMessageProps> = ({
  heading,
  subHeading,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        `flex flex-col p-2 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600`,
        className,
      )}
      role="alert"
    >
      {heading && (
        <div className="flex gap-2 items-center">
          <span>{icon}</span>
          <span className="font-bold">{heading}</span>
        </div>
      )}

      {/* <svg
        className="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg> */}

      {subHeading && (
        <div className="flex gap-2 items-center">
          {!heading ? <span>{icon}</span> : null}
          <div className="font-medium">{subHeading}</div>
        </div>
      )}
    </div>
  );
};
