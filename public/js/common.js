//share code that each pages can reuse (this file uses jquery)
$("#postTextarea").keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim()

    const submitButton = $("#submitPostButton")
    
    if (submitButton.length == 0) return alert("no submit button found")

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }
    submitButton.prop("disabled", false)
})

$("#submitPostButton").click(() => {
    const button = $(event.target);
    const textbox = $("#postTextarea");

    const data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, (postData, status, xhr) => {
        // console.log( postData)

        const html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

function createPostHtml(postData){
    return postData.content;
}
