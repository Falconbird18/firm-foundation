<script>
    export let isOpen = false;
</script>

<nav class:open={isOpen}>
    <div class="sidebar-header">
        <h3>Library</h3>
    </div>
    <ul>
        <li>
            <h4>Core Beliefs</h4>
            <ul>
                <li><a href="/library/is-jesus-god">Is Jesus God?</a></li>
                <li><a href="/library/trinity">The Trinity</a></li>
                <li><a href="/library/salvation">Salvation</a></li>
            </ul>
        </li>
        <li>
            <h4>Biblical Studies</h4>
            <ul>
                <li><a href="/library/bible-reliability">Is the Bible Reliable?</a></li>
                <li><a href="/library/bible-canon">The Biblical Canon</a></li>
            </ul>
        </li>
    </ul>
</nav>

<style>
    nav {
        background: var(--background-2);
        width: 300px;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        padding: 2rem;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
    }

    nav.open {
        transform: translateX(0);
    }

    .sidebar-header {
        margin-bottom: 2rem;
    }

    h3 {
        color: var(--primary);
        margin: 0;
    }

    h4 {
        color: var(--secondary);
        margin: 1.5rem 0 0.5rem 0;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li a {
        color: var(--text);
        text-decoration: none;
        padding: 0.5rem 0;
        display: block;
    }

    li a:hover {
        color: var(--primary);
    }
</style>