Cypress.Commands.add('purgeQueueMessages', () => {

  cy.api({
    url: Cypress.env('amqpHost') + '/tasks/contents',
    method: 'DELETE',
    body: {
      vhost: 'siohadmj',
      name: Cypress.env('amqpQueue'),
      mode: 'purge'
    },
    headers: {
      authorization: Cypress.env('amqpToken')
    },
    failOnStatusCode: false
  }).then(response => { return response })
})

Cypress.Commands.add('getMessageQueue', (retries = 8, delay = 2000) => {
  const call = () => {
    return cy.api({
      url: Cypress.env('amqpHost') + '/tasks/get',
      method: 'POST',
      body: {
        vhost: 'siohadmj',
        name: Cypress.env('amqpQueue'),
        count: 1,
        ackmode: 'ack_requeue_true',
        encoding: 'auto',
        truncate: 50000
      },
      headers: {
        authorization: Cypress.env('amqpToken'),
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false
    }).then(response => {
      const hasMessages = Array.isArray(response.body) && response.body.length > 0

      if ((response.status === 200 && hasMessages) || retries <= 0) {
        if (response.status === 200 && !hasMessages) {
          cy.log('getMessageQueue: status 200 recebido mas body vazio; retornando após esgotar tentativas')
        }
        if (response.status !== 200) {
          cy.log(`getMessageQueue: retorno final com status ${response.status}`)
          try { cy.log(JSON.stringify(response.body)) } catch (err) { cy.log('getMessageQueue: não foi possível serializar response.body') }
        }
        return cy.wrap(response)
      }

      cy.log(`getMessageQueue: recebido status ${response.status} ou body vazio, re-tentando em ${delay}ms (${retries - 1} tentativas restantes)`)
      try { cy.log(JSON.stringify(response.body)) } catch (err) { cy.log('getMessageQueue: não foi possível serializar response.body durante retry') }
      cy.wait(delay)
      return cy.getMessageQueue(retries - 1, delay)
    })
  }

  return call()
})