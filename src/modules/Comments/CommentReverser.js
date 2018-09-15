import Module from '../../class/Module';

class CommentsCommentReverser extends Module {
info = ({
    description: `
      <ul>
        <li>Reverses the comments of any <a href="https://www.steamgifts.com/discussion/e9zDo/">discussion</a> page so that they are ordered from newest to oldest.</li>
      </ul>
    `,
    id: `cr`,
    load: this.cr,
    name: `Comment Reverser`,
    sg: true,
    st: true,
    type: `comments`
  });

  cr() {
    if (!this.esgst.discussionPath || !this.esgst.pagination) return;
    this.esgst.modules.common.reverseComments(this.esgst.pagination.previousElementSibling);
  }
}

export default CommentsCommentReverser;