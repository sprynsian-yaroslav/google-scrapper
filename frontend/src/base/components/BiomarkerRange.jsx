import React from 'react'
import joinClassNames from "../helpers/joinClassNames";
import { usePowerUnitFormat } from "../hooks/usePowerUnitFormat";
import Icon from "./Icon";
import _ from "lodash";
import { createDispatchHook } from "react-redux";
import { CUSTOMER_RESULTS_CATEGORIES } from "../../groups/app/CustomerResults/constants";

const RANGE_IDS = {
  CRITICAL_LOW: 1,
  LOW: 2,
  SUB_OPTIMAL: 3,
  OPTIMAL: 4,
  SUPRA_OPTIMAL: 5,
  HIGH: 6,
  CRITICAL_HIGH: 7
}

export const checkOnDefined = (value) => !!value || value === 0;

export const orangeColorRule = {
  low: "criticalLow",
  high: "criticalHigh",
}

export const getColorOfMarker = (currentRange, filter = {}, defaultColorObject, secondColorObject, secondRuleResult = true) => {
  const rangeLevelForOrange = orangeColorRule[currentRange];
  if(!rangeLevelForOrange) return defaultColorObject;
  return (checkOnDefined(filter[rangeLevelForOrange]) && secondRuleResult) ? secondColorObject : defaultColorObject;
}

export const ALL_RANGES = [
  {
    rangeToApply: "criticalLowPercentage",
    rangesToApply: ["criticalLow"],
    id: RANGE_IDS.CRITICAL_LOW,
    rangeName: "Critical low",
    getColorOptions: (filter) => getColorOfMarker(
      "criticalLow",
      filter,
      { color: "biomarker-range-red", untestedColor: "bg-lightBlack", opacityForNotResult: "opacity-20" }
    )
  },
  {
    rangeToApply: "lowPercentage",
    rangesToApply: ["lowMin", "lowMax"],
    color: "biomarker-range-orange",
    id: RANGE_IDS.LOW,
    rangeName: "Low",
    untestedColor: "bg-grey",
    opacityForNotResult: "opacity-20",
    getColorOptions: (filter) => getColorOfMarker(
      "low",
      filter,
      { color: "biomarker-range-red", untestedColor: "bg-lightBlack", opacityForNotResult: "opacity-20" },
      { color: "biomarker-range-orange", untestedColor: "bg-grey", opacityForNotResult: "opacity-20" }
    )
  },
  {
    rangeToApply: "subOptimalPercentage",
    rangesToApply: ["subOptimalMin", "subOptimalMax"],
    id: RANGE_IDS.SUB_OPTIMAL,
    rangeName: "Sub optimal",
    getColorOptions: (filter) => getColorOfMarker(
      "subOptimal",
      filter,
      { color: "biomarker-range-yellow", untestedColor: "bg-secondary", opacityForNotResult: "opacity-30", }
    )
  },
  {
    rangeToApply: "optimalPercentage",
    rangesToApply: ["optimalMin", "optimalMax"],
    id: RANGE_IDS.OPTIMAL,
    rangeName: "Optimal",
    isOptimal: true,
    getColorOptions: (filter) => getColorOfMarker(
      "optimal",
      filter,
      { color: "biomarker-range-green", untestedColor: "bg-disabledBlack", opacityForNotResult: "opacity-20", }
    )
  },
  {
    rangeToApply: "supraOptimalPercentage",
    rangesToApply: ["supraOptimalMin", "supraOptimalMax"],
    id: RANGE_IDS.SUPRA_OPTIMAL,
    rangeName: "Supra optimal",
    getColorOptions: (filter) => getColorOfMarker(
      "supraOptimal",
      filter,
      { color: "biomarker-range-yellow", untestedColor: "bg-secondary", opacityForNotResult: "opacity-30", }
    )
  },
  {
    rangeToApply: "highPercentage",
    rangesToApply: ["highMin", "highMax"],
    id: RANGE_IDS.HIGH,
    rangeName: "High",
    getColorOptions: (filter) => getColorOfMarker(
      "high",
      filter,
      { color: "biomarker-range-red", untestedColor: "bg-lightBlack", opacityForNotResult: "opacity-20" },
      { color: "biomarker-range-orange", untestedColor: "bg-grey", opacityForNotResult: "opacity-20" }
    )
  },
  {
    rangeToApply: "criticalHighPercentage",
    rangesToApply: ["criticalHigh", "criticalHighMax"],
    id: RANGE_IDS.CRITICAL_HIGH,
    rangeName: "Critical high",
    getColorOptions: (filter) => getColorOfMarker(
      "criticalHigh",
      filter,
      { color: "biomarker-range-red", untestedColor: "bg-lightBlack", opacityForNotResult: "opacity-20", }
    )
  },
];

export default function BiomarkerRange({
  filter = {},
  chosenResult,
  isResultScreen
}) {
  const isDNA = chosenResult.category = CUSTOMER_RESULTS_CATEGORIES.DNA_CATEGORY
  
  const { powerFormat } = usePowerUnitFormat();

  if (_.isEmpty(filter)) {
    return <></>
  }

  const hasResult = chosenResult.id;
  const { value, unit } = chosenResult;

  const recommendationRangeId = (isDNA && value < 0) ? RANGE_IDS.OPTIMAL : chosenResult.recommendationRange;

  const isOverrideMode = filter?.overrideSwitchStatus;
  let currentWidth = 0;
  let tooltipPositionPercents = 0;

  let rangesWithValues = _.chain(ALL_RANGES)
    .map((range, idx) => {
      // -- let's enrich our ranges with values from filter and caluclate colors --
      let width = null;
      if (isOverrideMode) {
        width = _.get(filter, [range.rangeToApply], null);
      }
      const [minKey, maxKey] = range.rangesToApply;
      const { opacityForNotResult, untestedColor, color } = range.getColorOptions(filter) || {};
      let min = _.get(filter, [minKey], null);
      let max = _.get(filter, [maxKey], null);

      // -- if range is critical low (that has only min value), then use 0 as min value and max as min --
      if (range.id === RANGE_IDS.CRITICAL_LOW) {
        if (isDNA) {
          max = undefined;
          min = undefined;
        } else if (!max) {
          max = min;
          min = 0;
        }
      }
  
      if (range.id === RANGE_IDS.OPTIMAL && isDNA) {
        max = 0;
        min = -3;
      }

      if (isOverrideMode) {
        if (value >= min && value <= max) {
          tooltipPositionPercents = _.divide(value - min, max - min) * width + currentWidth;
        }

        currentWidth = currentWidth + width;
      }

      console.log('chosenResult.recommendationRange', chosenResult.recommendationRange)
      const isResultRange = range.id === recommendationRangeId;

      return {
        ...range,
        min,
        max,
        opacityForNotResult,
        untestedColor,
        color,
        isResultRange,
        width
      };
    })
    // -- remove all ranges where min and max is null --
    .filter((range, idx) => {
      //
      // -- if overrideMode is on, ignore filtering by value ranges --
      if (isOverrideMode) {
        return true;
      }
      return _.some([range.min, range.max], _.isNumber);
    })
    .map((range, index, original) => {
      console.log('After filter');
      console.log(range);
      // -- if current max is not set, then take the next range min as current max --
      if (!range.max && original[index + 1] && original[index + 1].min) {
        range.max = original[index + 1].min;
      }
      // -- if for some reason admin forgot to fill max range value, let's try to calculate it from max existing value + optimal range width --
      if (!range.max && !original[index + 1]) {
        const optimalRange = _.find(original, { isOptimal: true });
        range.max = optimalRange ? range.min + (optimalRange.max - optimalRange.min) : 0;
      }
      if (!isOverrideMode) {
        range.width = range.max - range.min;
      }
      return range;
    })
    // -- filter ranges with 0 width --
    .filter('width')
    // -- sort them by id --
    .orderBy('id')
    .value();

  // -- get first and last ranges --
  const firstRange = _.first(rangesWithValues);
  const lastRange = _.last(rangesWithValues);
  
  // console.log(chosenResult)
  console.log(rangesWithValues);

  if (_.isEmpty(firstRange)) {
    return <></>;
  }

  // -- if first range min value is not set, let's set it to 0 --
  if (!firstRange.min) {
    firstRange.min = 0;
  }

  // -- just to recheck if we have set max value --
  let maxValue = lastRange.max ? lastRange.max : lastRange.min;

  // -- if overrideMode is on, check if value is out of ranges, if yes, then set it to default start or end of scale --
  if (isOverrideMode) {
    if (value > maxValue) {
      tooltipPositionPercents = 99;
    }

    if (value < firstRange) {
      tooltipPositionPercents = 1;
    }
  }

  // -- get result range index --
  const resultRangeIndex = _.findIndex(rangesWithValues, { id: recommendationRangeId });

  // -- calculate percent based on max value --
  const convertValueToPercent = (value) => {
    let result;

    // -- if result is not exist, then it's untested biomarker, show ranges proportionally --
    if (!hasResult) {
      result = 100 / rangesWithValues.length;
    } else {
      // -- if result is exist, check if we calculating range or tooltip and calculate range width --
      if (isOverrideMode) {
        result = tooltipPositionPercents;
      } else {
        let item, index;
        rangesWithValues.forEach((i, ix) => {
          if ((value >= i.min && value < i.max) || (value > i.min && value <= i.max)) {
            item = i;
            index = ix;
          }
        });
        
        if (!item) {
          result = value < rangesWithValues[0].min ? -1 : 101;
        } else {
          const basePercentage = 100 / rangesWithValues.length * index;
          const additionalPercentage = 100 - (item.max - value) / (item.max - item.min) * 100
          result = basePercentage + additionalPercentage / rangesWithValues.length
        }
      }
    }

    // -- limit marker position to the end of scale --
    if (result >= 100) {
      result = isResultScreen ? 99 : 100;
    }
    if (result <= 0) {
      result = isResultScreen ? 1 : 0;
    }
    return `${result}%`;
  }
  
  const convertedTooltipLeft = convertValueToPercent(value);

  return (<>
    <section className={'d-flex position-relative'}>
      {rangesWithValues.map((c) => {
        console.log('hasResult', hasResult)
        console.log('c.isResultRange', c.isResultRange)
        return (
          <div key={c.id} className={'d-flex position-relative w-100'}>
            <div className={`w-100`}>
              <div className={`${c.color} ${(!c.isResultRange && hasResult) ? c.opacityForNotResult: ''} w-100 h-12px`}/>
              <div className='biomarker-range-label'>{c.min}</div>
            </div>
          </div>
        )
      })}
      {hasResult && (
        <div className='position-absolute d-flex flex-column align-items-center h-82 top-m-15' style={{ left: `calc(${convertedTooltipLeft} - 8px)` }}>
          <div className='biomarker-range-arrow-down'/>
          <div className={joinClassNames('w-10 bg-black flex-fill')}/>
        </div>
      )}
    </section>
  </>);
}
