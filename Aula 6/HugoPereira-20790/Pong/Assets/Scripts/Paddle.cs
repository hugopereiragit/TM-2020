using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Paddle : MonoBehaviour
{
    public float speed;
    public Rigidbody2D rb;

    public Vector3 startPosition;

    private float movement;

    void Start()
    {
        startPosition = transform.position; // guarda primeira posicao
        
    }

    // Update is called once per frame
    void Update()
    {
        movement = Input.GetAxisRaw("Vertical"); // Deafult w/s movement
        rb.velocity = new Vector2(rb.velocity.x, movement * speed); // velocidade da paddle
        
    }

    public void Reset()
    {
        rb.velocity = Vector2.zero; // reset velocidade
        transform.position = startPosition;
    }
}
