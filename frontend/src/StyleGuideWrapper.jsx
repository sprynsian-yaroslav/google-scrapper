import React from "react"
import { BrowserRouter as Router, BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"

import store from "./store"
import { Formik } from "formik"
import styles from "./index.module.scss"

const Context = ({ children }) => (
    <Provider store={store}>
        <BrowserRouter>
            <Router>
                <Formik>
                    <section className={styles.wrapper}>
                    {children}
                    </section>
                </Formik>
            </Router>
        </BrowserRouter>
    </Provider>
);

export default Context
