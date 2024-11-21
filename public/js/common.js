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
    const postedBy = postData.postedBy;
    if (postedBy._id === undefined){
        return console.log('user obj not poulated')
    }
    const fullName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = postData.createdAt;

    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePicture}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='fullName'>${fullName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'> ${timestamp} </span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        `;
}
