import styles from "../pages/index.module.css";
// import styles from "./index.module.css";
import type { PropsWithChildren } from "react";
import Header from "./header";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.container}>{props.children}</div>
    </main>
  );
};
