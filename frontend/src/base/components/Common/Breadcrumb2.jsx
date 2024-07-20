import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"
import joinClassNames from "../../helpers/joinClassNames";
import Icon from "../Icon";

const Breadcrumb = props => {
  const { title, breadcrumbItems } = props
  const itemLength = breadcrumbItems.length

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-start justify-content-between">
          <div>
            <h4 className="mb-0 font-size-18">{title}</h4>
            {props.linkBack && <Link to={props.linkBack.link}>
              <div className="d-flex align-items-center gap-2 mt-2 text-secondary cursor-pointer">
                <Icon icon="arrowLeft" width={20} height={20} />
                {props.linkBack.title}
              </div>
            </Link>}
          </div>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {breadcrumbItems.map((item, key) => (
                <BreadcrumbItem key={key} active={key + 1 === itemLength}>
                  <Link to={item.link ?? "#"} className={joinClassNames(!item.link && "text-secondary")}>{item.title}</Link>
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItems: PropTypes.array,
  title: PropTypes.string
}

export default Breadcrumb
