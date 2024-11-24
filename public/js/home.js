//only the home page have access 
$(document).ready(() => {
    $.get("/api/posts", results => {
        // console.log(results);
        outputPosts(results, $(".postsContainer"))
    })
})
