using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Goal : MonoBehaviour
{
    // Start is called before the first frame update
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.CompareTag("ballTag"))
        {
            GameObject.Find("gameManagerObj").GetComponent<manager>().Player1Scored();
        }
    }
}
