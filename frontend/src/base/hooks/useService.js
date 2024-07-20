
const services = {};

/**
 *
 * @param {class} Service
 */
export const initService = (Service) => {
    const name = Service.$displayName;

    if (!name) {
        throw new Error("Please, add static property $displayName = <ServiceName> to the service")
    }

    services[name] = services[name] || new Service();
    return services[name]
};

export const useService = (Service) => initService(Service);

