import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import css from "./CreatePostForm.module.css";

interface CreatePostFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  body: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),
  body: Yup.string().required("Content is required").max(500, "Maximum 500 characters"),
});

export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });

  const initialValues: FormValues = {
    title: "",
    body: "",
  };

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    mutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create post"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
