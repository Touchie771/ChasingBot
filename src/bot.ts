const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals
const bot = mineflayer.createBot(
    {
        host: 'localhost',
        port: 25565,
        username: 'ChasingBot',
        auth: 'offline'
    }
)

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
    const defaultMove = new Movements(bot)
    let chasing = false
    let chaseTarget: any | null = null
    let attackInterval: NodeJS.Timeout | null = null

    function getNearestPlayerWithin(maxDistance: number) {
        let nearest: any | null = null
        let nearestDist = Infinity
        for (const name in bot.players) {
            if (name === bot.username) continue // never consider self
            const player = bot.players[name]
            if (!player || !player.entity) continue
            if (bot.entity && player.entity.id === bot.entity.id) continue // extra safety
            const dist = bot.entity.position.distanceTo(player.entity.position)
            if (dist < nearestDist && dist <= maxDistance) {
                nearest = player.entity
                nearestDist = dist
            }
        }
        return nearest
    }

    function startChasing(targetEntity: any) {
        chaseTarget = targetEntity
        chasing = true
        bot.chat(`Target acquired: ${targetEntity.username ?? 'player'}`)
        bot.pathfinder.setMovements(defaultMove)
        // true => dynamic goal so the path recalculates as the target moves
        bot.pathfinder.setGoal(new GoalFollow(targetEntity, 1), true)
        startAttacking(targetEntity)
    }

    function stopChasing(reason?: string) {
        if (chasing) {
            bot.chat(reason ? `Stopping chase (${reason}).` : 'Stopping chase.')
        }
        chasing = false
        chaseTarget = null
        bot.pathfinder.setGoal(null)
        stopAttacking()
    }

    function startAttacking(targetEntity: any) {
        stopAttacking() // Clear any existing interval
        
        attackInterval = setInterval(() => {
            if (!chasing || !chaseTarget || !bot.entity) {
                stopAttacking()
                return
            }

            const distance = bot.entity.position.distanceTo(chaseTarget.position)
            if (distance <= 3.5) { // Attack range
                // Attack the target
                bot.attack(chaseTarget)
            }
        }, 500) // Attack every 500ms
    }

    function stopAttacking() {
        if (attackInterval) {
            clearInterval(attackInterval)
            attackInterval = null
        }
    }

    bot.on('chat', function(username: string, message: string) {

        if (username === bot.username) return

        const target = bot.players[username] ? bot.players[username].entity : null
        if (message === 'come!') {
            if (!target) {
                bot.chat('I don\'t see you !')
                return
            }
            const p = target.position

            bot.pathfinder.setMovements(defaultMove)
            bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
        }
    })

    // Toggle chase when the bot is hit
    bot.on('entityHurt', (entity: any) => {
        if (!bot.entity) return
        if (entity.id !== bot.entity.id) return

        const attacker = getNearestPlayerWithin(5)
        if (!attacker) return

        // If already chasing and the same attacker hits again -> stop
        if (chasing && chaseTarget && attacker.id === chaseTarget.id) {
            stopChasing('toggled by attacker')
            return
        }

        // Otherwise start or switch chase to this attacker
        startChasing(attacker)
    })

    // If the chased player leaves or despawns, stop chasing
    bot.on('entityGone', (entity: any) => {
        if (chasing && chaseTarget && entity.id === chaseTarget.id) {
            stopChasing('target left')
        }
    })
})