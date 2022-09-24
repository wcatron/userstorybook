import { When, Then, Given } from '@cucumber/cucumber';
import assert from 'assert';
import { UserRepositoryFile } from '../../datasources/UserRepository';
import { UseCaseContext } from '../../usecases/context';
import { createUser } from '../../usecases/createUser';

type World = {
    context: UseCaseContext,
    returns: any
}

Given<World>('an admin named {string}', function (id) {
    this.context = {
        datasources: {
            userRepository: new UserRepositoryFile()
        },
        auth: {
            id,
            roles: ['admin']
        }
    }
})

Given<World>('a user that is not an admin', function () {
    this.context = {
        datasources: {
            userRepository: new UserRepositoryFile()
        },
        auth: {
            id: 'a user',
            roles: ['user']
        }
    }
})

Given('an unauthenticated session', function () {
    this.context = {
        auth: null
    }
})

When<World>('we attempt to create a user with the admin role and name {string}', async function (name) {
    try {
        this.returns = await createUser({ name, roles: ['user', 'admin'] }, this.context)
    } catch (e) {
        this.returns = e
    }
});

Then<World>('we should recieve an newly created admin back', async function () {
    assert.deepEqual(this.returns, {
        id: this.returns.id,
        name: 'Sarah',
        roles: ['user', 'admin']
    })
    const user = await this.context.datasources.userRepository.get(this.returns.id)
    assert.deepEqual(user?.roles, ['user', 'admin'])
});

let isError = (e: any) => {
    return e && e.stack && e.message && typeof e.stack === 'string'
        && typeof e.message === 'string';
}

Then<World>('we should recieve an error', async function () {
    assert(isError(this.returns), 'Should be an error')
});