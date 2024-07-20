import { stringifyParams } from "./useQueryString";
import { filterObjectFromNull } from "../helpers/object";
import { DateTime } from "luxon";

const transformPresetRange = (presetType, startDate, endDate) => {
  if(!presetType) return [presetType, startDate, endDate];
  const diffDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), "days").toObject().days;
  const newEndDate = DateTime.now().setZone("utc").set({ hours: 23, minutes: 59, seconds: 59});
  const newStartDate = newEndDate.minus({ days: diffDays }).setZone("utc").set({ hours: 0, minutes: 0, seconds: 0})
  return [presetType, newStartDate.toISO(), newEndDate.toISO()]
}

const updateDatesForPreset = ({
  activatedAtEndDate,
  activatedAtFilterType,
  activatedAtStartDate,

  labReceivedAtEndDate,
  labReceivedAtFilterType,
  labReceivedAtStartDate,

  resultAtEndDate,
  resultAtFilterType,
  resultAtStartDate,

  sampleAtEndDate,
  sampleAtFilterType,
  sampleAtStartDate,
}) => {
  const activatedAtRange = transformPresetRange(activatedAtFilterType, activatedAtStartDate, activatedAtEndDate);
  const labReceivedAtRange = transformPresetRange(labReceivedAtFilterType, labReceivedAtStartDate, labReceivedAtEndDate);
  const resultAtRange = transformPresetRange(resultAtFilterType, resultAtStartDate, resultAtEndDate);
  const sampledAtRange = transformPresetRange(sampleAtFilterType, sampleAtStartDate, sampleAtEndDate);

  return {
    activatedAtFilterType: activatedAtRange[0],
    activatedAtStartDate: activatedAtRange[1],
    activatedAtEndDate: activatedAtRange[2],

    labReceivedAtFilterType: labReceivedAtRange[0],
    labReceivedAtStartDate: labReceivedAtRange[1],
    labReceivedAtEndDate: labReceivedAtRange[2],

    resultAtFilterType: resultAtRange[0],
    resultAtStartDate: resultAtRange[1],
    resultAtEndDate: resultAtRange[2],

    sampleAtFilterType: sampledAtRange[0],
    sampleAtStartDate: sampledAtRange[1],
    sampleAtEndDate: sampledAtRange[2],
  }
}

const useSelectTemplate = () => {
  return (template = {}) => {
    const {
      id,
      name,
      isFavourite,
      statuses,
      categories,
      searchString,
      isPrivate,
      resultAtDaysCount,
      activatedAtDaysCount,
      labReceivedAtDaysCount,
      sampleAtDaysCount,
      dateOfBirthStart,
      dateOfBirthEnd,
      updatedAt,
      userId,
      createdAt,
      ...restOfTemplate
    } = template;

    return stringifyParams({
      templateId: id,
      templateName: name,
      search: searchString,
      status: statuses,
      category: categories,
      isPrivate,
      dateOfBirthStartDate: dateOfBirthStart,
      dateOfBirthEndDate: dateOfBirthEnd,
      ...updateDatesForPreset(filterObjectFromNull(restOfTemplate)),
    });
  };
}

export default useSelectTemplate