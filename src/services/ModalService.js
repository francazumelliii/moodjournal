import { reactive } from 'vue'

const modalState = reactive({
    component: null,
    props: {},
    isOpen: false,
    resolve: null,
})

function open(component, props = {}) {
    return new Promise((resolve) => {
        modalState.component = component
        modalState.props = props
        modalState.isOpen = true
        modalState.resolve = resolve
    })
}

function close(result = null) {
    modalState.isOpen = false
    if (modalState.resolve) {
        modalState.resolve(result)
    }
    modalState.component = null
    modalState.props = {}
    modalState.resolve = null
}


function showToast(component, props = {}, duration = 3000) {
    open(component, props)
    setTimeout(() => {
        close()
    }, duration)
}

export default {
    modalState,
    open,
    close,
    showToast,
}
