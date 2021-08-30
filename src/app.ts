/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	private kitSound: MRE.Actor = null;
	private assets: MRE.AssetContainer;

		//========================
	// Trigger volume object
	//========================
	private triggerVolume: MRE.Actor;

	//========================
	// An Actor to interface with the trigger volume
	//========================
	private hat: MRE.Actor;

	/*
	 * constructor
	 */
	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		/*
		* set up somewhere to store loaded assets (meshes, textures,
		* animations, gltfs, etc.)
		*/
		this.assets = new MRE.AssetContainer(this.context);

		//============================
		// Create the trigger area.
		// It will be a simple box primitive.
		//============================
		this.triggerVolume = MRE.Actor.CreatePrimitive(this.assets,
			{
				definition: { shape: MRE.PrimitiveShape.Box },
				actor: {
					transform: {
						local: {
							scale: { x: 0.5, y: 1, z: 1.75 }
						}
					},
					appearance: { enabled: false }
				},
				addCollider: true		/* Must have a collider for triggers. */
			}
		);

		//============================
		// Set the collider to be a trigger.
		// Note: UNDOCUMENTED BEHAVIOR: This must be done *after* the call to
		// create the actor.
		//============================
		this.triggerVolume.collider.isTrigger = true;

		// When an Actor enters the trigger volume, spawn a copy of a kit item
		this.triggerVolume.collider.onTrigger('trigger-enter', (actor) => this.kitItem());

		//============================
		// Create an Actor to interface with the trigger volume.  Make the Actor
		// wearable.
		//============================

		this.hat = MRE.Actor.CreateFromLibrary(this.context, {
			// attach an item to the user
			// Assign the return value of CreateFromLibrary() to a variable.
			//the number below is the item's artifact id.
			resourceId: 'artifact:1725170080645382585',
			actor: {
				attachment: {
					attachPoint: 'head'
				},
				transform: {
					local: {
						position: { x: 0.0, y: 0.2, z: 0.0 }
					}
				},
				rigidBody: {
					useGravity: false	// Don't let the actor fall when released.
				},
				collider: {
					geometry: {
						shape: MRE.ColliderType.Box,
						size: { x: 0.1, y: 0.1, z: 0.1 }
					}
				}
			}
		});
	}

	private userJoined(user: MRE.User) {
		// print the user's name to the console
		console.log(`${user.name} joined`)
	}

	/*
	* Callback for when the trigger volume is entered
	*/
	//=====================
	// Removed unused MRE.User parameter.  For this example, it would have needed to
	// be an MRE.Actor.
	//=====================
	private kitItem() {
		/*Spawn the kit item */
		this.kitSound = MRE.Actor.CreateFromLibrary(this.context, {
			// the number below is the item's artifact id.
			resourceId: 'artifact:1812869470075486548'
		});
	}
}
