<script>
    import { page } from '$app/stores';
</script>

<div class="library-container">
    <h1>Article Library</h1>
    <p class="library-intro">Explore our collection of articles on theological topics, biblical studies, and core Christian beliefs.</p>
    
    <div class="category-section">
        <h2>Core Beliefs</h2>
        <div class="article-grid">
            <a href="/library/is-jesus-god" class="article-card">
                <h3>Is Jesus Really God?</h3>
                <p>A thorough examination of the biblical evidence for the deity of Christ</p>
                <span class="read-more">Read More →</span>
            </a>
            <a href="/library/trinity" class="article-card">
                <h3>Understanding the Trinity</h3>
                <p>Learn about the nature of God as three persons in one being</p>
                <span class="read-more">Read More →</span>
            </a>
            <a href="/library/salvation" class="article-card">
                <h3>The Path to Salvation</h3>
                <p>Understanding God's plan for humanity's redemption</p>
                <span class="read-more">Read More →</span>
            </a>
        </div>
    </div>

    <div class="category-section">
        <h2>Biblical Studies</h2>
        <div class="article-grid">
            <a href="/library/bible-reliability" class="article-card">
                <h3>Is the Bible Reliable?</h3>
                <p>Discover the historical and textual evidence for the Bible's reliability</p>
                <span class="read-more">Read More →</span>
            </a>
            <a href="/library/bible-canon" class="article-card">
                <h3>The Biblical Canon</h3>
                <p>How we got our Bible and why we can trust it</p>
                <span class="read-more">Read More →</span>
            </a>
        </div>
    </div>
</div>

<style>
    .library-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 1rem;
    }

    .library-intro {
        text-align: center;
        color: var(--text);
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto 4rem auto;
    }

    .category-section {
        margin-bottom: 4rem;
    }

    .category-section h2 {
        color: var(--primary);
        margin-bottom: 2rem;
    }

    .article-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }

    .article-card {
        background: var(--background-2);
        padding: 2rem;
        border-radius: var(--secondary-radius);
        text-decoration: none;
        transition: transform 0.2s;
        display: flex;
        flex-direction: column;
    }

    .article-card:hover {
        transform: translateY(-4px);
    }

    .article-card h3 {
        color: var(--primary);
        margin: 0 0 1rem 0;
    }

    .article-card p {
        color: var(--text);
        margin: 0 0 1.5rem 0;
        opacity: 0.9;
        flex-grow: 1;
    }

    .read-more {
        color: var(--secondary);
        font-weight: 500;
    }

    .article-card:hover .read-more {
        color: var(--primary);
    }
</style>