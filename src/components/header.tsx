import styles from "../pages/index.module.css";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
// import styles from "./index.module.css";

export const Header = () => {
    return (
        <>
            <SignedOut>
                <div className={styles.header}>
                    <h2 className={styles.logo}>LOGO</h2>
                    <SignInButton />
                </div>
            </SignedOut>
            <SignedIn>
                <div className={styles.header}>
                    <h2 className={styles.logo}>LOGO</h2>
                    <UserButton />
                </div>
            </SignedIn>
        </>
    )
}