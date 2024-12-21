import styles from './index.module.scss';
import { NavLink, Outlet } from 'react-router';

const Layout = () => {

  const links = [
    {
      name: '首页',
      path: '/',
    },
    {
      name: 'calendar-mini',
      path: '/calendar-test',
    },
    {
      name: 'calendar-enterprise',
      path: '/calendar-enterprise',
    },
  ]
  return (
    <div className={styles.container}>
      <div className={styles.header}>header</div>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          <ul>
            {links.map(v => (
              <li key={v.path}>
                <NavLink to={v.path}>
                  {v.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default Layout