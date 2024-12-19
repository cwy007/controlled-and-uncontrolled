import React from 'react'
import styles from './index.module.scss';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>header</div>
      <div className={styles.sidebar}>sidebar</div>
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout