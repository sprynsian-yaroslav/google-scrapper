import React from 'react';
import { Spinner } from "reactstrap";

export default function PageSpinner(){
  return (
    <section className="vh-75 d-flex justify-content-center align-items-center">
      <Spinner color='info' />
    </section>
  )
}