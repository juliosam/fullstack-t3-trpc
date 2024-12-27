import styles from "../pages/index.module.css";
// import styles from "./index.module.css";
import { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className={styles.main}>
            {props.children}
        </main>
    )
}