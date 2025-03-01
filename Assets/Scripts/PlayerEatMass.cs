using NUnit.Framework;
using UnityEngine;
using System.Collections.Generic;

public class EatingScript : MonoBehaviour
{
    public GameObject[] Mass;

    public void UpdateMass()
    {
        Mass = GameObject.FindGameObjectsWithTag("Mass");
    }

    public void addMass(GameObject MassObject) 
    {
        List<GameObject> MassList = new List<GameObject>();
        for(int i = 0; i < Mass.Length; i++)
        {
            MassList.Add(Mass[i]);
        }
        MassList.Add(MassObject);
        Mass = MassList.ToArray();
    }

    public void RemoveMass(GameObject MassObject)
    {
        List<GameObject> MassList = new List<GameObject>();
        for (int i = 0; i < Mass.Length; i++)
        {
            MassList.Add(Mass[i]);
        }
        MassList.Remove(MassObject);
        Mass = MassList.ToArray();
    }

    public void CheckMass()
    {
        for (int i = 0; i < Mass.Length; i++)
        {
            Transform m = Mass[i].transform;
            if (Vector2.Distance(transform.position, m.position) <= transform.localScale.x / 2)
            {
                RemoveMass(m.gameObject);
                PlayerEat();
                Destroy(m.gameObject);
            }
        }
    }

    private void Start()
    {
        UpdateMass();
        InvokeRepeating("CheckMass", 0, 0.1f);
    }

    public void PlayerEat()
    {
        transform.localScale += new Vector3(0.25f, 0.25f, 0.25f);
    }

}
