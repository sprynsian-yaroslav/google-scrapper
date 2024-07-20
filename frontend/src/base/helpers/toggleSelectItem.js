export const toggleSelectItem = (item, value, onChange) => {
    const itemIndex = value.findIndex(selectedItem => selectedItem.id === item.id);
    if (itemIndex !== -1) {
        const updatedValue = value.filter(selectedItem => selectedItem.id !== item.id);
        onChange(updatedValue);
    } else {
        const updatedValue = [...value, item];
        onChange(updatedValue);
    }
};
