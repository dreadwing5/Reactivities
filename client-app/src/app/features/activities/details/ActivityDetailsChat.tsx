import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment, Header, Comment, Button } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import MyTextArea from "../../../common/form/MyTextArea";

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }
    return () => {
      commentStore.clearComments(); // cleanup method
    };
  }, [commentStore, activityId]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Formik
            onSubmit={(values, { resetForm }) => {
              commentStore.addComment(values).then(() => resetForm());
            }}
            initialValues={{ body: "" }}
          >
            {({ handleSubmit, isValid, isSubmitting }) => (
              <Form className="ui form" onSubmit={handleSubmit}>
                <MyTextArea placeholder="Add comment" name="body" rows={2} />
                <Button
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  type="submit"
                  primary
                  floated="right"
                />
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
