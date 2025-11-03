<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Simple file-based CMS backend
class LumakaraCMS {
    private $dataDir = '../data/';
    
    public function __construct() {
        if (!file_exists($this->dataDir)) {
            mkdir($this->dataDir, 0777, true);
        }
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_GET['path'] ?? '';
        
        switch ($method) {
            case 'GET':
                return $this->getData($path);
            case 'POST':
                return $this->saveData($path);
            case 'DELETE':
                return $this->deleteData($path);
            default:
                http_response_code(405);
                return ['error' => 'Method not allowed'];
        }
    }
    
    private function getData($path) {
        $file = $this->dataDir . $path . '.json';
        if (file_exists($file)) {
            return json_decode(file_get_contents($file), true);
        }
        return [];
    }
    
    private function saveData($path) {
        $input = json_decode(file_get_contents('php://input'), true);
        $file = $this->dataDir . $path . '.json';
        
        if (file_put_contents($file, json_encode($input, JSON_PRETTY_PRINT))) {
            // Update HTML files after saving
            $this->updateHTMLFiles();
            return ['success' => true];
        }
        return ['error' => 'Failed to save data'];
    }
    
    private function deleteData($path) {
        $file = $this->dataDir . $path . '.json';
        if (file_exists($file) && unlink($file)) {
            $this->updateHTMLFiles();
            return ['success' => true];
        }
        return ['error' => 'Failed to delete data'];
    }
    
    private function updateHTMLFiles() {
        // Update index.html with latest blog posts
        $this->updateIndexPage();
        // Update blog.html with all posts
        $this->updateBlogPage();
        // Update service.html with services
        $this->updateServicePage();
    }
    
    private function updateIndexPage() {
        $blogs = $this->getData('blog');
        $services = $this->getData('services');
        
        // Read current index.html
        $indexFile = '../index.html';
        if (!file_exists($indexFile)) return;
        
        $html = file_get_contents($indexFile);
        
        // Update blog section
        $latestBlogs = array_slice($blogs, 0, 3);
        $blogHTML = '';
        
        foreach ($latestBlogs as $blog) {
            $blogHTML .= $this->generateBlogCard($blog);
        }
        
        // Replace blog section in HTML
        $pattern = '/<!-- BLOG_SECTION_START -->.*?<!-- BLOG_SECTION_END -->/s';
        $replacement = "<!-- BLOG_SECTION_START -->\n" . $blogHTML . "\n<!-- BLOG_SECTION_END -->";
        $html = preg_replace($pattern, $replacement, $html);
        
        file_put_contents($indexFile, $html);
    }
    
    private function generateBlogCard($blog) {
        $date = date('d M Y', strtotime($blog['date']));
        return "
        <div class=\"col-lg-4 col-md-6 mt-30\">
            <div class=\"xb-blog xb-hover-zoom pos-rel ul_li\">
                <div class=\"xb-item--img\">
                    <img src=\"{$blog['image']}\" alt=\"{$blog['title']}\">
                </div>
                <div class=\"xb-item--inner ul_li\">
                    <div class=\"xb-item--author\">
                        <div class=\"xb-item--avatar\">
                            <img src=\"assets/img/team/lumakara-team.jpg\" alt=\"\">
                        </div>
                        <h3 class=\"xb-item--name\"><span>By</span>: {$blog['author']}</h3>
                        <h5 class=\"xb-item--date\">{$date}</h5>
                    </div>
                    <div class=\"xb-item--holder\">
                        <h2 class=\"xb-item--title\">{$blog['title']}</h2>
                        <p class=\"xb-item--content\">" . substr(strip_tags($blog['content']), 0, 120) . "...</p>
                        <div class=\"xb-item--tags\">
                            " . implode(' ', array_map(function($tag) { return "<span class=\"tag\">#$tag</span>"; }, $blog['tags'])) . "
                        </div>
                    </div>
                </div>
                <a class=\"xb-overlay\" href=\"blog-single.html?slug={$blog['slug']}\"></a>
            </div>
        </div>";
    }
    
    private function updateBlogPage() {
        // Create blog.html if not exists
        $this->createBlogPage();
    }
    
    private function createBlogPage() {
        $blogs = $this->getData('blog');
        
        $blogHTML = '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Lumakara</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <div class="container">
        <h1>Blog Lumakara</h1>
        <div class="row">';
        
        foreach ($blogs as $blog) {
            $blogHTML .= $this->generateBlogCard($blog);
        }
        
        $blogHTML .= '
        </div>
    </div>
    <script src="js/lumakara-dynamic.js"></script>
</body>
</html>';
        
        file_put_contents('../blog.html', $blogHTML);
    }
    
    private function updateServicePage() {
        // Similar implementation for services
    }
}

// Handle the request
$cms = new LumakaraCMS();
echo json_encode($cms->handleRequest());
?>