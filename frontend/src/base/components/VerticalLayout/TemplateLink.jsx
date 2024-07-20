import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { EllipsisWithTooltip } from "../Table/components";
import useSelectTemplate from "../../hooks/useSelectTemplate";
import { useService } from "../../hooks/useService";
import { CUSTOMER_RESULTS_LINKS } from "../../../groups/app/CustomerResults/config";
import UserResultsService from "../../../services/UserResults";
import { transformJsDateToIso } from "../../helpers/date";
import { parseQuery, useLocationQuery } from "../../hooks/useQueryString";
import joinClassNames from "../../helpers/joinClassNames";

export const MAX_RESULTS_TO_SHOW = 999;
export const ONE_HOUR_IN_MS = 3600000;

export default function TemplateLink({ template, setActiveLinkToCustomerResults }) {
  /**
   * @type {UserResultsService}
   */
  const userResultsService = useService(UserResultsService);

  const { name, id } = template;
  const divRef = useRef();

  const navigate = useNavigate();
  const locationQuery = useLocationQuery();

  const { templateId } = locationQuery.getAll();

  const isActiveTemplate = templateId?.toString() === id?.toString();

  const [resultsCount, updateResultsCount] = useState(0);

  const getTemplateQuery = useSelectTemplate();

  const templateSearch = useMemo(() => {
    return getTemplateQuery({ ...template, id, name })
  }, [id]);

  const pollCounterOfResults = useCallback(() => {
    const {
      search,
      status,
      dateOfBirthStartDate,
      dateOfBirthEndDate,
      activatedAtStartDate,
      activatedAtEndDate,
      sampleAtStartDate,
      sampleAtEndDate,
      resultAtStartDate,
      resultAtEndDate,
      labReceivedAtStartDate,
      labReceivedAtEndDate,
      activatedAtFilterType,
      sampleAtFilterType,
      resultAtFilterType,
      labReceivedAtFilterType
    } = parseQuery(templateSearch);

    userResultsService.getUserResults({
      limit: 100,
      offset: 0,
      search: search || undefined,
      status,
      dateOfBirthStartDate: transformJsDateToIso(dateOfBirthStartDate, true),
      dateOfBirthEndDate: transformJsDateToIso(dateOfBirthEndDate, true, true),
      activatedAtStartDate: transformJsDateToIso(activatedAtStartDate, !activatedAtFilterType),
      activatedAtEndDate: transformJsDateToIso(activatedAtEndDate, !activatedAtFilterType, !activatedAtFilterType),
      sampleAtStartDate: transformJsDateToIso(sampleAtStartDate, !sampleAtFilterType),
      sampleAtEndDate: transformJsDateToIso(sampleAtEndDate, !sampleAtFilterType, !sampleAtFilterType),
      resultAtStartDate: transformJsDateToIso(resultAtStartDate, !resultAtFilterType),
      resultAtEndDate: transformJsDateToIso(resultAtEndDate, !resultAtFilterType, !resultAtFilterType),
      labReceivedAtStartDate: transformJsDateToIso(labReceivedAtStartDate, !labReceivedAtFilterType),
      labReceivedAtEndDate: transformJsDateToIso(labReceivedAtEndDate, !labReceivedAtFilterType, !labReceivedAtFilterType),
      withErrorNotifications: 1
    })
      .then(({ pagination }) => {
        updateResultsCount(pagination.totalCount)
      })
  }, [templateSearch]);

  useEffect(() => {
    pollCounterOfResults();

    const interval = setInterval(() => {
      pollCounterOfResults();
    }, ONE_HOUR_IN_MS)

    return () => {
      clearInterval(interval)
    }
  }, [templateSearch]);

  return (
    <Link
      onClick={(event) => {
        event.preventDefault();
        navigate({
          pathname: CUSTOMER_RESULTS_LINKS.LIST,
          search: templateSearch,
        })
        setActiveLinkToCustomerResults()
      }}
      className="position-relative pe-5"
    >
      <EllipsisWithTooltip fullText={name} id={`template-${id}`} divRef={divRef}>
        <div className={joinClassNames(
          "w-100 text-truncate",
          isActiveTemplate && "text-white"
        )} ref={divRef}>
          {name}
        </div>
      </EllipsisWithTooltip>
      <div className={joinClassNames(
        "sidebar-templates__counter",
        isActiveTemplate && "active"
      )}>
        {resultsCount > MAX_RESULTS_TO_SHOW ? `${MAX_RESULTS_TO_SHOW}+` : resultsCount}
      </div>
    </Link>
  )
}
