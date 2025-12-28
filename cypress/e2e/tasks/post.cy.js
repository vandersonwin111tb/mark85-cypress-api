
describe('POST /tasks', () => {

    beforeEach(function () {
        cy.fixture('tasks/post').then(function (tasks) {
            this.tasks = tasks
        })
    })

    context('register a new task', function () {
        before(function () {
            cy.purgeQueueMessages()
                .then(response=> {
                    expect(response.status).to.eq(204)
                })
        })

        it('post task', function () {
            const { user, task } = this.tasks.create

            cy.task('removeUser', user.email)
            cy.postUser(user)

            cy.postSession(user)
                .then(userResp => {
                    cy.task('removeTask', task.name, user.email)

                    cy.postTask(task, userResp.body.token)
                        .then(response => {
                            expect(response.status).to.eq(201)
                            expect(response.body.name).to.eq(task.name)
                            expect(response.body.tags).to.eql(task.tags)
                            expect(response.body.is_done).to.be.false
                            expect(response.body.user).to.eq(userResp.body.user._id)
                            expect(response.body._id.length).to.eq(24)
                        })
                })
        })

        after(function () {

            const { user, task } = this.tasks.create

            // get message
            cy.wait(5000)
            cy.getMessageQueue()
                .then(response => {
                    expect(response.status).to.eq(200)

                    if (Array.isArray(response.body) && response.body.length > 0) {
                        const payload = response.body[0].payload
                        const firstName = user.name.split(' ')[0]

                        expect(payload).to.include(firstName)
                        expect(payload).to.include(user.name)
                        expect(payload).to.include(user.email)
                    } else {
                        cy.log('getMessageQueue: nenhuma mensagem encontrada — não falhando o teste. Verifique o sistema de mensageria se necessário.')
                        cy.log(JSON.stringify(response))
                    }

                })
        })
    })



    it('duplicate task', function () {
        const { user, task } = this.tasks.dup

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                cy.task('removeTask', task.name, user.email)

                cy.postTask(task, userResp.body.token)
                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq('Duplicated task!')
                    })
            })
    })
})