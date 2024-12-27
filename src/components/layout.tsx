import styles from "../pages/index.module.css";
// import styles from "./index.module.css";
import { PropsWithChildren } from "react";
import { Header } from "./header";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className={styles.main}>
            <Header/>
            {props.children}
        </main>
    )
}