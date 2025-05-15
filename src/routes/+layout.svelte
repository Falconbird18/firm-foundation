<script>
    import "../app.css";
    import Sidebar from "$lib/components/Sidebar.svelte";
    let isSidebarOpen = false;
</script>

<header>
    <nav class="main-nav">
        <div class="nav-left">
            <button class="menu-button" on:click={() => isSidebarOpen = !isSidebarOpen}>
                <span class="menu-icon"></span>
            </button>
            <a href="/" class="logo">Firm Foundation</a>
        </div>
        <div class="nav-right">
            <a href="/firm-foundation/basics">Christian basics</a>
            <a href="/firm-foundation/library">Library</a>
            <a href="/firm-foundation/about">About</a>
        </div>
    </nav>
</header>

<Sidebar isOpen={isSidebarOpen} />

<main>
    <slot />
</main>

<style>
    header {
        background: var(--background-2);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .main-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .nav-left, .nav-right {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        color: var(--primary);
        font-size: 1.5rem;
        text-decoration: none;
        font-weight: 300;
        font-family: 'Roboto';
    }

    .nav-right a {
        color: var(--text);
        text-decoration: none;
        font-weight: 300;
        font-family: 'Roboto';
    }

    .nav-right a:hover {
        color: var(--primary);
    }

    .menu-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
    }

    .menu-icon {
        display: block;
        width: 24px;
        height: 2px;
        background: var(--text);
        position: relative;
    }

    .menu-icon::before,
    .menu-icon::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 2px;
        background: var(--text);
        left: 0;
    }

    .menu-icon::before {
        top: -8px;
    }

    .menu-icon::after {
        bottom: -8px;
    }

    main {
        margin-top: 4rem;
        min-height: calc(100vh - 4rem);
    }
</style>