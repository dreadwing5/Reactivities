import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment, Header, Comment, Button, Loader } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Formik, Form, Field, FieldProps } from "formik";
import MyTextArea from "../../../common/form/MyTextArea";
import * as Yup from "yup";

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
                <Comment.Text
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Formik
            onSubmit={(values, { resetForm }) => {
              commentStore.addComment(values).then(() => resetForm());
            }}
            validationSchema={Yup.object({
              body: Yup.string().required("Comment body is required"),
            })}
            initialValues={{ body: "" }}
          >
            {({ handleSubmit, isValid, isSubmitting }) => (
              <Form className="ui form" onSubmit={handleSubmit}>
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        {...props.field}
                        rows={2}
                        placeholder="Enter your comment (Enter to submit, Shift + Enter for new line)"
                        className="form-control"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.shiftKey) {
                            e.preventDefault();
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (isValid) handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
