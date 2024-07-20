export default function joinClassNames(...classNames) {
    return classNames.filter(item => item).join(' ');
}