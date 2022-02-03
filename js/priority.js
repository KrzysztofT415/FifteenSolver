class QElement {
    constructor(element, priority) {
        this.element = element
        this.priority = priority
    }
}

class PriorityQueue {
    constructor(...args) {
        this.items = []
        for (const arg of args) this.enqueue(arg, 0)
    }

    enqueue(element, priority) {
        let qElement = new QElement(element, priority)
        let contain = false

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement)
                contain = true
                break
            }
        }
        if (!contain) this.items.push(qElement)
    }

    dequeue() {
        if (this.isEmpty()) return null
        return this.items.shift()
    }
    front() {
        if (this.isEmpty()) return null
        return this.items[0]
    }
    pop() {
        if (this.isEmpty()) return null
        let pop = this.items[0]
        this.items.shift()
        return pop
    }
    rear() {
        if (this.isEmpty()) return null
        return this.items[this.items.length - 1]
    }
    isEmpty() {
        return this.items.length === 0
    }
}
if (typeof window === 'undefined') module.exports = PriorityQueue
