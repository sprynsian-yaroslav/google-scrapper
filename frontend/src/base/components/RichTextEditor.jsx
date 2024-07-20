import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { useField } from "formik";
import { useTranslate } from "../hooks/useTranslate";
import joinClassNames from "../helpers/joinClassNames";

export const TOOLBAR_OPTIONS = ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', 'link'];

export default function RichTextEditor({
  value,
  onChange,
  label,
  description,
  placeholder,
  disabled,
  name,
  Tabs,
  maxLength,
}) {
  const [field, { error, touched }, { setTouched }] = useField({ name });
  const [translate] = useTranslate();

    const handleEditorDataChange = (event, editor) => {
        const data = editor.getData();

        const strippedData = data.replace(/<[^>]*>/g, '');
        const cleanedData = strippedData.replace(/&nbsp;/g, ' ');

        const textLength = cleanedData.length;
        if (maxLength && textLength > maxLength) {
            editor.setData(value);
            return;
        }

        onChange(data);
    };

  return (
    <section className={joinClassNames("editor-container", error && touched && "editor-invalid")}>
      <label className={joinClassNames("editor-container__label", !description && "mb-2")}>{label}</label>
      {description &&
        <p
          className={joinClassNames("editor-container__description", error && touched && "is-invalid")}>{description}</p>
      }
      {!!Tabs && Tabs}
      <CKEditor

        editor={DecoupledEditor}
        disabled={disabled}

        config={{
          toolbar: TOOLBAR_OPTIONS,
          placeholder,
          link: {
            addTargetToExternalLinks: true
          }
        }}
        id={name}
        data={value}
        onBlur={() => setTouched(true)}
        onReady={editor => {
          if (!editor || editor?.ui?.getEditableElement().previousSibling.getAttribute("role") === "toolbar"){
            editor.ui.getEditableElement().previousSibling.remove()
          }
          editor?.ui?.getEditableElement().parentElement.insertBefore(
            editor?.ui?.view.toolbar.element,
            editor?.ui?.getEditableElement()
          );
        }}
        onChange={handleEditorDataChange}
      />
      <span className="invalid-feedback d-block">{translate(error, { label })}</span>
    </section>
  )
}