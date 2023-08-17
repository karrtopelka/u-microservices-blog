const renderContent = (status, content) => {
  switch (status) {
    case 'approved':
      return content;
    case 'rejected':
      return 'Comment is rejected';
    default:
      return 'Comment is on moderation';
  }
};

const CommentsList = ({ comments }) => {
  return (
    <div>
      <ul>
        {comments.map(({ commentId, content, status }) => (
          <li key={commentId}>{renderContent(status, content)}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentsList;
