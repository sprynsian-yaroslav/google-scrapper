import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useService } from "../../../../base/hooks/useService";
import BaseLayoutWithCard from "../../../../base/components/BaseLayoutWithCard";

import Button from "../../../../base/components/Button";
import { useLoading } from "../../../../base/hooks/useLoading";
import PageSpinner from "../../../../base/components/PageSpinner";
import ValueWithLabel from "./components/ValueWIthLabel";

import KeywordsService from "../../../../services/KeywordsService";
import ScrapingResultsService from "../../../../services/ScrapingResultService";
import { KEYWORDS_GROUP_LINKS } from "../config";
import ToastService from "../../../../services/ToastService";
import ScrapingResultsList from "./components/ScrapingResultList";


export default function KeywordDetails() {
    /**
     * @type {KeywordsService}
     */
    const keywordsService = useService(KeywordsService);
    /**
     * @type {ScrapingResultsService}
     */
    const scrapingResultsService = useService(ScrapingResultsService);
    /**
     * @type {ToastService}
     */
    const toastService = useService(ToastService);

    const [keyword, setKeyword] = useState(null);

    const [isLoading, { registerPromise }] = useLoading(true);
    const navigate = useNavigate();

    const { id } = useParams();

    const startCheck = () => {
        scrapingResultsService.startScraping(id)
            .then(() => {
                toastService.success("Scraping started")
            })
    }

    useEffect(() => {
        if (id) {
            registerPromise(keywordsService.getKeywordById(id))
                .then((data) => {
                    setKeyword(data);
                });
        }
    }, [id]);

    const breadcrumbs = {
        title: "Keyword detailed view",
        breadcrumbItems: [
            { title: "Keywords", link: KEYWORDS_GROUP_LINKS.BASE },
            { title: "Keyword detailed view" }
        ]
    };

    return <BaseLayoutWithCard breadcrumbs={breadcrumbs}>
        {isLoading
            ? <PageSpinner/>
            : <>
                <section className="d-flex align-items-start justify-content-between mb-4">
                    <label className="font-weight-semibold font-size-15">General information</label>
                </section>

                <section className="d-flex justify-content-between mb-4">
                    <ValueWithLabel value={keyword?.keyword} label="Keyword"/>

                    <ValueWithLabel value={keyword?.createdAt} label="Created at"/>

                    <ValueWithLabel value={keyword?.lastCheckAt} label="Last check date"/>
                </section>

                <section className="d-flex justify-content-between mb-4">
                    <ValueWithLabel value={keyword?.isCheck.toString()} label="Is check"/>
                </section>

                <Button
                    onClick={startCheck}
                >
                    Start check
                </Button>

                <section className="mt-5">
                    <ScrapingResultsList keywordId={id} />
                </section>
            </>
        }
    </BaseLayoutWithCard>;
}