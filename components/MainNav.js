import React from 'react';
import Link from 'next/link';

export default () => (
  <header className="header">
    <nav className="header__nav">
      <ul className="list-inline">
        <li>
          <Link prefetch href="/search-lawyers-by-speciality?ajax=1" as="/search-lawyers-by-speciality/">
            <a>SEARCH FOR A LAWYER</a>
          </Link>
        </li>
        <li>
          <a href="/pitch-a-project-for-a-lawyer/">PITCH A PROJECT</a>
        </li>
        <li style={{ position: 'absolute', right: '0' }}>
          <small>© Ben Bowes 2017</small>
        </li>
      </ul>
    </nav>

    <hr />

    <a href="/" style={{ display: 'block', position: 'absolute' }}>
      <img
        style={{ width: '40px', height: '76px', cursor: 'pointer' }}
        src="/static/images/lawlist.png"
        alt="Logo"
        title="LawList"
      />
    </a>
  </header>
);
