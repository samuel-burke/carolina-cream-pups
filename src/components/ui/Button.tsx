import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.css";

type CommonProps = {
  children: ReactNode;
  variant?: "solid" | "ghost";
  full?: boolean;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type NativeButtonProps = CommonProps & {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
};

type Props = LinkButtonProps | NativeButtonProps;

/**
 * Action element. Renders an accessible <Link> when `href` is provided
 * (preferred for navigation + SEO), otherwise a native <button>.
 */
export function Button(props: Props) {
  const { children, variant = "solid", full, className } = props;
  const cls = [styles.btn, styles[variant], full ? styles.full : "", className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} onClick={props.onClick} className={cls}>
      {children}
    </button>
  );
}
